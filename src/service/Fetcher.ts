import axios, {AxiosResponse} from "axios";

const base = "http://localhost:3000";

export const fetcher = async <T>(method: string, url: string, body: any): Promise<T> => {
    const axiosInstance = axios.create({
        baseURL: base,
        timeout: 5000
    });

    const res = await axiosInstance({
        url: url,
        method,
        headers: {
            "Content-Type": "application/json"
        },
        data: body
    }).then((res: AxiosResponse) => res.data);

    return new Promise((resolve, reject) =>
        setTimeout(() => {
            if (res.status !== 500) {
                resolve(res as T);
            } else {
                reject(res);
            }
        }, 1)
    );
}
