namespace Help {

  export class HelpTopic {

    topicName: string;
    subTopicName: string;
    label: string;
    path:string;
    isValid: any;
    selected: boolean;

    isIndexTopic(): boolean {
      return this.topicName === 'index';
    }
  }
}