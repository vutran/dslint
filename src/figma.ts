import { Client } from 'figma-js';

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || '';

export async function getProjectData(projectKey: string) {
  if (!FIGMA_TOKEN) {
    throw new Error('Missing Figma Token');
  }

  const client = Client({ personalAccessToken: FIGMA_TOKEN });
  const { data } = await client.file(projectKey);

  return data;
}
