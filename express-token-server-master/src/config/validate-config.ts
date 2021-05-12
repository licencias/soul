import { AppConfig } from "./app-config-model";

export const validateAppConfig = (config: AppConfig): void => {

  // control via browser is not allowed on production personas
  if (config.controlViaBrowser && config.productionPersona) {
    throw new Error(`
      CONFIGURATION ERROR:
      controlViaBrowser is not allowed on production personas.
      Please disable controlViaBrowser or use a development persona.
    `);
  }

  // control via browser can only be used if an orchestration server is provided
  if (config.controlViaBrowser && config.orchestrationServer === '') {
    throw new Error(`
      CONFIGURATION ERROR:
      controlViaBrowser requires an orchestration server.
      Please set variable ORCHESTRATION_SERVER.
    `);
  }

}
