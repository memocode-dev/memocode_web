import dynamic from 'next/dynamic';

const MyMemoEditPage = dynamic(() => import('@/pages/myMemo/MyMemoEditPage'), {
    ssr: false
});

export default async function MyMemoEdit() {

    return <MyMemoEditPage/>
}