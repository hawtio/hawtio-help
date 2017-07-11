/// <reference path="help.component.ts"/>
/// <reference path="help.config.ts"/>
/// <reference path="help.service.ts"/>

namespace Help {

    angular
      .module('hawtio-help', [])
      .config(HelpConfig)
      .run(HelpRun)
      .component('help', helpComponent)
      .service('helpService', HelpService)

    hawtioPluginLoader.addModule(pluginName);
}