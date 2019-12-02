import { NetWork } from './NetWork';
const $http = NetWork.getInstance();

export default class Action {

    sessionKey: string = 'local_form_data';

    getSession() {
        // 教师端预览时从浏览器缓存中取数据
        return JSON.parse(sessionStorage.getItem(this.sessionKey));
    }

    getQuery() {
        // 从URL获取参数
        let query = $http.GetRequest();
        $http.courseware_id = query['id'];
        $http.title_id = query['title_id'];
        $http.user_id = query['user_id'];
    }

    getCourseContent(setTips: Function) {
        return new Promise((resolve, reject) => {
            $http.httpRequest(
                `${NetWork.GET_QUESTION}?courseware_id=${$http.courseware_id}`,
                'GET', 'application/json;charset=utf-8',
                (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        let res = JSON.parse(response);
                        // resolve(res.data.courseware_content);
                        resolve(res);
                    }
                }
            )
        })
    }
} 