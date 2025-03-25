import checkDiskSpace from 'check-disk-space';
/**
 * Wrapper of the check-disk-space library.
 *
 * @internal
 */
export declare const DiskUsageLibProvider: {
    provide: string;
    useValue: typeof checkDiskSpace;
};
