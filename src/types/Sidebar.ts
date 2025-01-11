export type navsType = {
    text: string | null;
    line: boolean;
    children: {
        id:number;
        icon: string;
        label: string;
        path: string;
        m_user_type_id: number[];
    }[];
}