export interface SmootherConfig {
    radius: number;
    reduceCommands: boolean;
    numberAccuracy: number;
    preventOverflow: boolean;
    allowEllipse: boolean;
}

export interface PolygonSmootherConfig extends SmootherConfig {
    closePath: boolean;
}

export function defaultConfig(config?: Partial<SmootherConfig>): SmootherConfig {
    return {
        radius: config?.radius ?? 10,
        reduceCommands: config?.reduceCommands ?? true,
        numberAccuracy: config?.numberAccuracy ?? 3,
        preventOverflow: config?.preventOverflow ?? true,
        allowEllipse: config?.allowEllipse ?? true,
    };
}

export function defaultPolygonConfig(config?: Partial<PolygonSmootherConfig>): PolygonSmootherConfig {
    return {
        ...defaultConfig(config),
        closePath: config?.closePath ?? true,
    };
}
