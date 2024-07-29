import MyBlogMemos from "@/components/page_components/myBlog/MyBlogMemos";
import MyBlogSeries from "@/components/page_components/myBlog/MyBlogSeries";
import MyBlogQnA from "@/components/page_components/myBlog/MyBlogQnA";
import MyBlogAbout from "@/components/page_components/myBlog/MyBlogAbout";

interface MyBlogTabsContentProps {
    lastPath: string;
    annotation_username: string;
}

const MyBlogTabsContent = ({lastPath, annotation_username}: MyBlogTabsContentProps) => {
    return (
        <>
            {lastPath === annotation_username && <MyBlogAbout/>}
            {lastPath === "about" && <MyBlogAbout/>}
            {lastPath === "memos" && <MyBlogMemos/>}
            {lastPath === "series" && <MyBlogSeries/>}
            {lastPath === "q&a" && <MyBlogQnA/>}
        </>
    );
};

export default MyBlogTabsContent;
