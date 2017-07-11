/// <reference path="./help.registry.ts"/>

namespace Help {

    export class HelpService {

        constructor(private $templateCache, private helpRegistry: HelpRegistry) {
          'ngInject';
        }

        getBreadcrumbs(): HelpTopic[] {
          return this.helpRegistry.getTopics().filter((topic) => {
            if (topic.isIndexTopic() === true) {
              topic.label = this.helpRegistry.mapSubTopicName(topic.subTopicName);
              return topic;
            }
          });
        }

        getSections(): HelpTopic[] {
          let sections = this.helpRegistry.getTopics().filter((topic) => {
            if (topic.isIndexTopic() === false) {
              topic.label = this.helpRegistry.mapTopicName(topic.topicName);
              return topic;
            }
          });

          return _.sortBy(sections, 'label');
        }

        getTopics(): HelpTopic[] {
          return this.helpRegistry.getTopics();
        }

        getTopic(topicName: string, subTopicName: string): HelpTopic {
          return this.helpRegistry.getTopic(topicName, subTopicName);
        }

        getHelpContent(topic: HelpTopic) : string {
          if (!angular.isDefined(topic)) {
            return "Unable to display help data for " + topic.path;
          } else {
            let template = this.$templateCache.get(topic.path);
            if (template) {
              return marked(template);
            } else {
              return "Unable to display help data for " + topic.path;
            }
          }
        }
    }
}
