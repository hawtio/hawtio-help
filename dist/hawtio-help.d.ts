/// <reference types="angular" />
declare namespace Help {
    class HelpRegistry {
        $rootScope: any;
        private topicNameMappings;
        private subTopicNameMappings;
        private topics;
        constructor($rootScope: any);
        addUserDoc(topicName: string, path: string, isValid?: () => boolean): void;
        addDevDoc(topicName: string, path: string, isValid?: () => boolean): void;
        addSubTopic(topicName: string, subtopic: string, path: any, isValid?: () => boolean): void;
        getOrCreateTopic(topicName: string, subTopicName: string, path: string, isValid?: () => boolean): HelpTopic;
        mapTopicName(name: any): any;
        mapSubTopicName(name: any): any;
        getTopics(): HelpTopic[];
        getTopic(topicName: string, subTopicName: string): HelpTopic;
    }
}
declare namespace Help {
    class HelpService {
        private $templateCache;
        private helpRegistry;
        constructor($templateCache: any, helpRegistry: HelpRegistry);
        getBreadcrumbs(): HelpTopic[];
        getSections(): HelpTopic[];
        getTopics(): HelpTopic[];
        getTopic(topicName: string, subTopicName: string): HelpTopic;
        getHelpContent(topic: HelpTopic): string;
    }
}
declare namespace Help {
    class HelpController {
        private $location;
        private $templateCache;
        private $rootScope;
        private marked;
        private helpService;
        breadcrumbs: HelpTopic[];
        sections: HelpTopic[];
        selectedTopic: HelpTopic;
        selectedBreadcrumb: HelpTopic;
        html: any;
        constructor($location: any, $templateCache: any, $rootScope: any, marked: any, helpService: HelpService);
        $onInit(): void;
        onSelectTopic(topic: HelpTopic): void;
        onSelectBreadcrumb(topic: HelpTopic): void;
    }
    const helpComponent: angular.IComponentOptions;
}
declare namespace Help {
    function HelpConfig($routeProvider: any, $provide: any): void;
    function HelpRun(helpRegistry: any, viewRegistry: any, layoutFull: any, $templateCache: any): void;
}
declare namespace Help {
    var pluginName: string;
    var templatePath: string;
    var log: Logging.Logger;
}
declare namespace Help {
}
declare namespace Help {
    class HelpTopic {
        topicName: string;
        subTopicName: string;
        label: string;
        path: string;
        isValid: any;
        selected: boolean;
        isIndexTopic(): boolean;
    }
}
