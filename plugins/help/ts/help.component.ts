/// <reference path="help.service.ts"/>

namespace Help {
    export class HelpController {

      breadcrumbs: HelpTopic[];
      sections: HelpTopic[];
      selectedTopic: HelpTopic;
      selectedBreadcrumb: HelpTopic;
      html: any;

      constructor(private $location, private $templateCache, private $rootScope, private marked, private helpService:HelpService) {
        'ngInject';
        $rootScope.$on('hawtioNewHelpTopic', function () {
          this.breadcrumbs = this.helpService.getBreadcrumbs();
          this.sections = this.helpService.getSections();
        });
      }

      $onInit() {
        this.breadcrumbs = this.helpService.getBreadcrumbs();
        this.sections = this.helpService.getSections();
        this.onSelectBreadcrumb(this.helpService.getTopic('index', 'user'));
      }

      onSelectTopic(topic: HelpTopic) {
        this.selectedTopic = topic;
        this.html = this.helpService.getHelpContent(topic)
      }

      onSelectBreadcrumb(topic: HelpTopic) {
        this.selectedBreadcrumb = topic;
        this.selectedTopic = null;
        this.html = this.helpService.getHelpContent(topic)
      }
    }

  export const helpComponent = <angular.IComponentOptions>{
    templateUrl: 'plugins/help/html/help.html',
    controller: HelpController
  };
}