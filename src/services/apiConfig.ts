/**
 * API設定ファイル - 環境ごとのAPI設定とデフォルト設定を提供
 */

// API基本URL - 環境変数から取得
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

// APIタイムアウト設定（ミリ秒）
export const API_TIMEOUT = 30000;

// API認証用ヘッダー設定
export const getAuthHeaders = () => {
  // ローカルストレージからトークンを取得（実際の認証システム導入時に実装）
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// API共通ヘッダー
export const getCommonHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...getAuthHeaders(),
  };
};

// API URLを生成
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// TODO: 実際のアプリケーションでは認証機能から取得する
export const getUserId = (): string => {
  return "test-user-1";
};

// エラーメッセージをユーザーフレンドリーな形式に変換
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;

  // APIからのエラーレスポンス
  if (error.response && error.response.data) {
    if (error.response.data.message) return error.response.data.message;
    if (error.response.data.error) return error.response.data.error;
  }

  // アクセスエラーかタイムアウト
  if (error.code === 'ECONNABORTED') return 'リクエストがタイムアウトしました。ネットワーク接続を確認してください。';
  if (error.message) return error.message;

  // デフォルトメッセージ
  return '操作中にエラーが発生しました。もう一度お試しください。';
};
