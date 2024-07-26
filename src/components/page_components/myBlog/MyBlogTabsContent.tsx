import MyBlogMemos from "@/components/page_components/myBlog/MyBlogMemos";
import MyBlogSeries from "@/components/page_components/myBlog/MyBlogSeries";
import MyBlogQnA from "@/components/page_components/myBlog/MyBlogQnA";
import MyBlogAbout from "@/components/page_components/myBlog/MyBlogAbout";

interface MyBlogTabsContentProps {
    lastPath: string;
    username: string;
}

const MyBlogTabsContent = ({lastPath, username}: MyBlogTabsContentProps) => {
    console.log(lastPath)
    return (
        <>
            {lastPath === `@${username}` && <MyBlogAbout/>}
            {lastPath === "about" && <MyBlogAbout/>}
            {lastPath === "memos" && <MyBlogMemos username={username}/>}
            {lastPath === "series" && <MyBlogSeries/>}
            {lastPath === "q&a" && <MyBlogQnA/>}
        </>
    );
};

export default MyBlogTabsContent;
