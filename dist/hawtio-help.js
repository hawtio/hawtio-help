var Help;
(function (Help) {
    var HelpRegistry = (function () {
        function HelpRegistry($rootScope) {
            this.$rootScope = $rootScope;
            this.topicNameMappings = {
                activemq: 'ActiveMQ',
                camel: 'Camel',
                jboss: 'JBoss',
                jclouds: 'jclouds',
                jmx: 'JMX',
                jvm: 'Connect',
                log: 'Logs',
                openejb: 'OpenEJB',
                osgi: 'OSGi'
            };
            this.subTopicNameMappings = {
                user: 'User Guide',
                developer: 'Developers',
                faq: 'FAQ',
                changes: 'Change Log',
            };
            this.topics = [];
        }
        HelpRegistry.prototype.addUserDoc = function (topicName, path, isValid) {
            if (isValid === void 0) { isValid = null; }
            this.addSubTopic(topicName, 'user', path, isValid);
        };
        HelpRegistry.prototype.addDevDoc = function (topicName, path, isValid) {
            if (isValid === void 0) { isValid = null; }
            this.addSubTopic(topicName, 'developer', path, isValid);
        };
        HelpRegistry.prototype.addSubTopic = function (topicName, subtopic, path, isValid) {
            if (isValid === void 0) { isValid = null; }
            this.getOrCreateTopic(topicName, subtopic, path, isValid);
        };
        HelpRegistry.prototype.getOrCreateTopic = function (topicName, subTopicName, path, isValid) {
            if (isValid === void 0) { isValid = null; }
            var topic = this.getTopic(topicName, subTopicName);
            if (!angular.isDefined(topic)) {
                if (isValid === null) {
                    isValid = function () {
                        return true;
                    };
                }
                topic = new Help.HelpTopic();
                topic.topicName = topicName;
                topic.subTopicName = subTopicName;
                topic.path = path;
                topic.isValid = isValid;
                this.topics.push(topic);
                this.$rootScope.$broadcast('hawtioNewHelpTopic');
            }
            return topic;
        };
        HelpRegistry.prototype.mapTopicName = function (name) {
            if (angular.isDefined(this.topicNameMappings[name])) {
                return this.topicNameMappings[name];
            }
            return name;
        };
        HelpRegistry.prototype.mapSubTopicName = function (name) {
            if (angular.isDefined(this.subTopicNameMappings[name])) {
                return this.subTopicNameMappings[name];
            }
            return name;
        };
        HelpRegistry.prototype.getTopics = function () {
            var answer = this.topics.filter(function (topic) {
                return topic.isValid() === true;
            });
            return answer;
        };
        HelpRegistry.prototype.getTopic = function (topicName, subTopicName) {
            return this.topics.filter(function (topic) {
                return topic.topicName === topicName && topic.subTopicName === subTopicName;
            })[0];
        };
        return HelpRegistry;
    }());
    Help.HelpRegistry = HelpRegistry;
})(Help || (Help = {}));
/// <reference path="./help.registry.ts"/>
var Help;
(function (Help) {
    var HelpService = (function () {
        function HelpService($templateCache, helpRegistry) {
            'ngInject';
            this.$templateCache = $templateCache;
            this.helpRegistry = helpRegistry;
        }
        HelpService.prototype.getBreadcrumbs = function () {
            var _this = this;
            return this.helpRegistry.getTopics().filter(function (topic) {
                if (topic.isIndexTopic() === true) {
                    topic.label = _this.helpRegistry.mapSubTopicName(topic.subTopicName);
                    return topic;
                }
            });
        };
        HelpService.prototype.getSections = function () {
            var _this = this;
            var sections = this.helpRegistry.getTopics().filter(function (topic) {
                if (topic.isIndexTopic() === false) {
                    topic.label = _this.helpRegistry.mapTopicName(topic.topicName);
                    return topic;
                }
            });
            return _.sortBy(sections, 'label');
        };
        HelpService.prototype.getTopics = function () {
            return this.helpRegistry.getTopics();
        };
        HelpService.prototype.getTopic = function (topicName, subTopicName) {
            return this.helpRegistry.getTopic(topicName, subTopicName);
        };
        HelpService.prototype.getHelpContent = function (topic) {
            if (!angular.isDefined(topic)) {
                return "Unable to display help data for " + topic.path;
            }
            else {
                var template = this.$templateCache.get(topic.path);
                if (template) {
                    return marked(template);
                }
                else {
                    return "Unable to display help data for " + topic.path;
                }
            }
        };
        return HelpService;
    }());
    Help.HelpService = HelpService;
})(Help || (Help = {}));
/// <reference path="help.service.ts"/>
var Help;
(function (Help) {
    var HelpController = (function () {
        function HelpController($location, $templateCache, $rootScope, marked, helpService) {
            'ngInject';
            this.$location = $location;
            this.$templateCache = $templateCache;
            this.$rootScope = $rootScope;
            this.marked = marked;
            this.helpService = helpService;
            $rootScope.$on('hawtioNewHelpTopic', function () {
                this.breadcrumbs = this.helpService.getBreadcrumbs();
                this.sections = this.helpService.getSections();
            });
        }
        HelpController.prototype.$onInit = function () {
            this.breadcrumbs = this.helpService.getBreadcrumbs();
            this.sections = this.helpService.getSections();
            this.onSelectBreadcrumb(this.helpService.getTopic('index', 'user'));
        };
        HelpController.prototype.onSelectTopic = function (topic) {
            this.selectedTopic = topic;
            this.html = this.helpService.getHelpContent(topic);
        };
        HelpController.prototype.onSelectBreadcrumb = function (topic) {
            this.selectedBreadcrumb = topic;
            this.selectedTopic = null;
            this.html = this.helpService.getHelpContent(topic);
        };
        return HelpController;
    }());
    Help.HelpController = HelpController;
    Help.helpComponent = {
        templateUrl: 'plugins/help/html/help.html',
        controller: HelpController
    };
})(Help || (Help = {}));
var Help;
(function (Help) {
    function HelpConfig($routeProvider, $provide) {
        'ngInject';
        $routeProvider.when('/help', { template: '<help></help>' });
        $provide.decorator('helpRegistry', ['$delegate', '$rootScope', function ($delegate, $rootScope) {
                return new Help.HelpRegistry($rootScope);
            }]);
    }
    Help.HelpConfig = HelpConfig;
    function HelpRun(helpRegistry, viewRegistry, layoutFull, $templateCache) {
        'ngInject';
        viewRegistry['help'] = layoutFull;
        helpRegistry.addUserDoc('index', 'plugins/help/doc/overview.md');
        // These docs live in the main hawtio project
        helpRegistry.addSubTopic('index', 'faq', 'plugins/help/doc/FAQ.md', function () {
            return $templateCache.get('plugins/help/doc/FAQ.md') !== undefined;
        });
        helpRegistry.addSubTopic('index', 'changes', 'plugins/help/doc/CHANGES.md', function () {
            return $templateCache.get('plugins/help/doc/CHANGES.md') !== undefined;
        });
    }
    Help.HelpRun = HelpRun;
})(Help || (Help = {}));
var Help;
(function (Help) {
    Help.pluginName = 'hawtio-help';
    Help.templatePath = 'plugins/help/html';
    Help.log = Logger.get(Help.pluginName);
})(Help || (Help = {}));
/// <reference path="help.component.ts"/>
/// <reference path="help.config.ts"/>
/// <reference path="help.service.ts"/>
var Help;
(function (Help) {
    angular
        .module('hawtio-help', [])
        .config(Help.HelpConfig)
        .run(Help.HelpRun)
        .component('help', Help.helpComponent)
        .service('helpService', Help.HelpService);
    hawtioPluginLoader.addModule(Help.pluginName);
})(Help || (Help = {}));
var Help;
(function (Help) {
    var HelpTopic = (function () {
        function HelpTopic() {
        }
        HelpTopic.prototype.isIndexTopic = function () {
            return this.topicName === 'index';
        };
        return HelpTopic;
    }());
    Help.HelpTopic = HelpTopic;
})(Help || (Help = {}));

angular.module("hawtio-help-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/help/html/help.html","<div class=\"help-ht\">\n\n  <h1>Help</h1>\n \n  <ul class=\"nav nav-tabs\">\n    <li ng-repeat=\"breadcrumb in $ctrl.breadcrumbs\" ng-class=\"{active : breadcrumb === $ctrl.selectedBreadcrumb}\">\n      <a href=\"#\" ng-click=\"$ctrl.onSelectBreadcrumb(breadcrumb)\">{{breadcrumb.label}}</a>\n    </li>\n  </ul>\n\n  <div ng-show=\"$ctrl.selectedBreadcrumb.subTopicName === \'user\'\">\n    <div>\n      <div class=\"col-sm-9 col-md-10 col-sm-push-3 col-md-push-2\">\n        <div ng-hide=\"!$ctrl.html\">\n          <div compile=\"$ctrl.html\"></div>\n        </div>\n      </div>\n      <div class=\"col-sm-3 col-md-2 col-sm-pull-9 col-md-pull-10 sidebar-pf\">\n        <div class=\"nav-category\">\n          <ul class=\"nav nav-pills nav-stacked\">\n            <li ng-repeat=\"section in $ctrl.sections\" ng-class=\"{active : section === $ctrl.selectedTopic}\">\n              <a class=\"help-sectionlink\" ng-href=\"#\" ng-click=\"$ctrl.onSelectTopic(section)\">{{section.label}}</a>\n            </li>\n          </ul>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div ng-show=\"$ctrl.selectedBreadcrumb.subTopicName !== \'user\'\">\n    <div compile=\"$ctrl.html\"></div>\n  </div>\n</div>\n");
$templateCache.put("plugins/help/doc/overview.md","##### Plugin Help #####\nBrowse the available help topics for plugin specific documentation using the help navigation bar on the left.\n\n##### Further Reading #####\n- [hawtio](http://hawt.io \"hawtio\") website\n- Chat with the hawtio team on IRC by joining **#hawtio** on **irc.freenode.net**\n- Help improve [hawtio](http://hawt.io \"hawtio\") by [contributing](http://hawt.io/contributing/index.html)\n- [hawtio on github](https://github.com/hawtio/hawtio)\n");
$templateCache.put("plugins/help/doc/test/activemq.md","## ActiveMQ\n\nTest documentation for ActiveMQ\n");
$templateCache.put("plugins/help/doc/test/camel.md","## Camel\n\nTest documentation for camel\n");
$templateCache.put("plugins/help/doc/test/osgi.md","## OSGi\n\nTest documentation for OSGi\n");}]); hawtioPluginLoader.addModule("hawtio-help-templates");