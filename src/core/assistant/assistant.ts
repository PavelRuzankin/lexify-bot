import OpenAIApi from 'openai';
import { sleep } from 'openai/core';

export default class Assistant<ResponseType> {
  private _thread: OpenAIApi.Beta.Threads.Thread | null = null

  constructor(private _api: OpenAIApi, private _assistantId: string) {}

  async fetch(req: unknown): Promise<ResponseType | null> {
    try {
      if(!this._thread) {
        this._thread = await this.createThread();
      }
  
      await this._api.beta.threads.messages.create(
        this._thread.id,
        {
          role: "user",
          content: JSON.stringify(req)
        }
      );
  
      const run = await this._api.beta.threads.runs.create(
        this._thread.id,
        {
          assistant_id: this._assistantId,
          instructions: "Use the function tool for this query."
        },
      );

      const response = await this.executeRun(run)
      console.log('response', response);

      return response ? JSON.parse(response) : null
    } catch(error) {
      console.error('Error while fetching assistant', error)
      return null
    }
  }

  private createThread() {
    return this._api.beta.threads.create()
  }

  private async executeRun(run: OpenAIApi.Beta.Threads.Runs.Run): Promise<string | null> {
    if(!this._thread) return null;

    let runStatus = await this._api.beta.threads.runs.retrieve(
      this._thread.id,
      run.id
    );
  
    while (runStatus.status !== "completed" && runStatus.status !== "failed") {
      await sleep(1500);
      console.log(runStatus.status);
      if(runStatus.status === 'requires_action') {
        const steps = await this._api.beta.threads.runs.steps.list(this._thread.id, run.id)
        await this._api.beta.threads.runs.cancel(this._thread.id, run.id)

        // @ts-ignore
        const response: string = steps.data?.[0]?.step_details?.tool_calls?.[0]?.['function'].arguments

        return response ?? null
      } else {
        runStatus = await this._api.beta.threads.runs.retrieve(
          this._thread.id,
          run.id
        );
      }
    }

    return null
  }
}
