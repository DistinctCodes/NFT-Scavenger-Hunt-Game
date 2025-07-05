import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUnlockRulesTable1719679730000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'unlock_rules',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'target_puzzle_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'prerequisite_puzzle_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['PREREQUISITE', 'CUSTOM'],
            default: 'PREREQUISITE',
          },
          {
            name: 'custom_condition',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['target_puzzle_id'],
            referencedTableName: 'puzzles',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['prerequisite_puzzle_id'],
            referencedTableName: 'puzzles',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'unlock_rules',
      new TableIndex({
        name: 'IDX_UNLOCK_RULES_TARGET',
        columnNames: ['target_puzzle_id'],
      }),
    );

    await queryRunner.createIndex(
      'unlock_rules',
      new TableIndex({
        name: 'IDX_UNLOCK_RULES_PREREQUISITE',
        columnNames: ['prerequisite_puzzle_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('unlock_rules');
  }
}
