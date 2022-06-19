import {config} from 'dotenv';

export const REQUIRED_ENVIRONMENT_VARIABLE_NAMES = [
  'DATABASE_URL',
  'KAKAO_ME_URL',
  'FB_TYPE',
  'FB_PROJECT_ID',
  'FB_PRIVATE_KEY_ID',
  'FB_PRIVATE_KEY',
  'FB_CLIENT_EMAIL',
  'FB_CLIENT_ID',
  'FB_AUTH_URI',
  'FB_TOKEN_URI',
  'FB_AUTH_PROVIDER_X509_CERT_URL',
  'FB_CLIENT_X509_CERT_URL',
  'PORT',
] as const;

const environmentVariableNames: Record<string, string> = config().parsed || {};

for (let i = 0; i < REQUIRED_ENVIRONMENT_VARIABLE_NAMES.length; i++) {
  if (
    typeof environmentVariableNames[REQUIRED_ENVIRONMENT_VARIABLE_NAMES[i]] !==
    'string'
  ) {
    throw new Error('Unconfigured environment variable');
  }
}
