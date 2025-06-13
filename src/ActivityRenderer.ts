import * as Handlebars from "handlebars";
import { DateTime } from "luxon";
import { stringifyYaml } from "obsidian";
import type { Activity } from "./Activity";

export const DEFAULT_TEMPLATE = `# {{name}}

[https://www.strava.com/activities/{{id}}](https://www.strava.com/activities/{{id}})
{{#if description}}

Description: {{description}}
{{/if}}
{{#if private_note}}

> [!NOTE] Private note
> {{private_note}}
{{/if}}

#Strava
`;

export class ActivityRenderer {
  template: string;
  dateFormat: string;
  frontMatterProperties?: string[];

  constructor(
    template: string,
    dateFormat: string,
    frontMatterProperties?: string[],
  ) {
    this.template = template;
    this.dateFormat = dateFormat;
    this.frontMatterProperties = frontMatterProperties;
  }

  render(activity: Activity) {
    const start_date = DateTime.fromJSDate(
      new Date(activity.start_date),
    ).toFormat(this.dateFormat);

    const bodyContent = Handlebars.compile(this.template)({
      ...activity,
      start_date: start_date,
      icon: this.getActivityIcon(activity.sport_type),
    });

    return (
      (this.frontMatterProperties ? this.renderFrontMatter(activity) : "") +
      bodyContent
    );
  }

  renderFrontMatter(activity: Activity) {
    const frontMatter: { [id: string]: unknown } = {
      id: activity.id,
    };

    this.frontMatterProperties?.forEach((property) => {
      frontMatter[property] =
        property === "icon"
          ? this.getActivityIcon(activity.sport_type)
          : activity[property];
    });

    return `---\n${stringifyYaml(frontMatter)}---\n`;
  }

  private getActivityIcon(sportType: string): string {
    switch (sportType.toLowerCase()) {
      case "alpineski":
      case "backcountryski":
      case "nordicski":
      case "rollerski":
        return "⛷️";
      case "badminton":
        return "🏸";
      case "canoeing":
      case "kayaking":
        return "🛶";
      case "crossfit":
      case "weighttraining":
      case "workout":
        return "🏋️";
      case "ebikeride":
      case "velomobile":
      case "ride":
        return "🚴";
      case "gravelride":
        return "G🚴";
      case "virtualride":
        return "I🚴";
      case "elliptical":
      case "stairstepper":
      case "walk":
        return "🚶";
      case "emountainbikeride":
      case "mountainbikeride":
        return "🚵";
      case "golf":
        return "⛳";
      case "handcycle":
      case "wheelchair":
        return "🦽";
      case "highintensityintervaltraining":
        return "🏃";
      case "hike":
        return "🥾";
      case "iceskate":
        return "⛸️";
      case "inlineskate":
        return "🛼";
      case "kitesurf":
      case "windsurf":
      case "standuppaddling":
      case "surfing":
        return "🏄";
      case "pickleball":
      case "tabletennis":
        return "🏓";
      case "pilates":
      case "yoga":
        return "🧘";
      case "rockclimbing":
        return "🧗";
      case "rowing":
      case "virtualrow":
        return "🚣";
      case "run":
      case "trailrun":
      case "virtualrun":
        return "🏃";
      case "sail":
        return "⛵";
      case "skateboard":
        return "🛹";
      case "snowboard":
        return "🏂";
      case "snowshoe":
        return "🥾";
      case "soccer":
        return "⚽";
      case "squash":
      case "racquetball":
      case "tennis":
        return "🎾";
      case "swim":
        return "🏊";
      default:
        return "🏅";
    }
  }
}
