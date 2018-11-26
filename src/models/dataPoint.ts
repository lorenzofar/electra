export interface sensorsData {
    [sensor: string]: number;
}

export default interface DataPoint {
    timestamp: number; // Hold UNIX timestamp
    data: sensorsData; // Hold values retrieved by sensors
}