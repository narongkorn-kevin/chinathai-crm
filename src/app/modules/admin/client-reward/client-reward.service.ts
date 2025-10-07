import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { removeEmpty } from 'app/helper';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ClientRewardService {

    constructor(private _httpClient: HttpClient) {}

    datatable(parameters: any) {
        const payload = removeEmpty({ ...parameters });

        return this._httpClient
            .post('/api/client_reward_page', payload)
            .pipe(
                map((resp: any) => {
                    if (Array.isArray(resp?.data?.data)) {
                        resp.data.data = resp.data.data.map((item: any) => {
                            const member = item.member ?? {};
                            const reward = item.reward ?? {};

                            return {
                                ...item,
                                memberCode: member.code ?? '',
                                memberName: `${member.fname ?? ''} ${member.lname ?? ''}`.trim(),
                                rewardCode: reward.code ?? '',
                                rewardName: reward.name ?? '',
                            };
                        });
                    }

                    return resp;
                }),
            );
    }

    updateStatus(id: number, status: string) {
        return this._httpClient.put(`/api/update_status_client_reward/${id}`, {
            status,
        });
    }
}
