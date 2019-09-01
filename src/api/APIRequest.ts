import axios from 'axios';
import World from '../world/World';

enum AnalyticsEvent {
    WebGLInitFailed = 'webgl_init_failed',
    WebGLInitSuccess = 'webgl_init_success',
    EditorStarted = 'editor_started',
    EditorExited = 'editor_exited',
}

export default class APIRequest {

    public static AnalyticsEvent = AnalyticsEvent;

    public static baseURL = 
    /// #if ENV_PRODUCTION
        'https://api.tapotan.com'
    /// #else
        'http://localhost:3001'
    /// #endif
    ;

    public static post(endpoint: string, data: object = {}) {
        return axios.post(APIRequest.baseURL + endpoint, data);
    }

    public static get(endpoint: string, data: object = {}) {
        return axios.get(APIRequest.baseURL + endpoint, { params: data });
    }

    public static markLevelAsFinished(world: World) {
        return APIRequest.post('/mark_level_as_finished', {
            id: world.getLevelPublicID()
        });
    }

    public static logAnalyticsEvent(eventName: AnalyticsEvent, data: any = {}) {
        return APIRequest.post('/log_analytics_event', {
            event: eventName,
            ...data
        });
    }
}