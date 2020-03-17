const axios = require("axios");
const chalk = require("chalk");
import { TestRailOptions, TestRailResult, TestRun } from "./testrail.interface";
import moment = require("moment");

export class TestRail {
  private base: String;
  private runId: Number;

  constructor(private options: TestRailOptions) {
    this.base = `https://${options.domain}/index.php?/api/v2`;
  }

  public createRun(name: string, description: string) {
    axios({
      method: "post",
      url: `${this.base}/add_run/${this.options.projectId}`,
      headers: { "Content-Type": "application/json" },
      auth: {
        username: this.options.username,
        password: this.options.password
      },
      data: JSON.stringify({
        suite_id: this.options.suiteId,
        name,
        description,
        include_all: true
      })
    })
      .then(response => {
        console.log("Creating test run... ---> run id is:  ", response.data.id);
        this.runId = response.data.id;
      })
      .catch(error => {
        console.error(error);
      });
  }

  public publishResults(results: TestRailResult[]) {
    axios({
      method: "post",
      url: `${this.base}/add_results_for_cases/${this.runId}`,
      headers: { "Content-Type": "application/json" },
      auth: {
        username: this.options.username,
        password: this.options.password
      },
      data: JSON.stringify({ results })
    })
      .then(() => {
        console.log("\n", chalk.magenta.underline.bold("(TestRail Reporter)"));
        console.log(
          "\n",
          ` - Results are published to ${chalk.magenta(
            `https://${this.options.domain}/index.php?/runs/view/${this.runId}`
          )}`,
          "\n"
        );
      })
      .catch(error => console.error(error));
  }
}
