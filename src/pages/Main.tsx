import {AiFillLike, AiOutlineComment} from "react-icons/ai";
import {IoGlasses} from "react-icons/io5";

const Main = () => {

    const testData = [
        {
            title: "title",
            content: "content",
            like: 100,
            view: 50,
            comment: 20,
            imgUrl: "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
        },
        {
            title: "title",
            content: "content",
            like: 100,
            view: 50,
            comment: 20,
            imgUrl: "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
        },
        {
            title: "title",
            content: "content",
            like: 100,
            view: 50,
            comment: 20,
            imgUrl: "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
        },
        {
            title: "title",
            content: "content",
            like: 100,
            view: 50,
            comment: 20,
            imgUrl: "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
        },
        {
            title: "title",
            content: "content",
            like: 100,
            view: 50,
            comment: 20,
            imgUrl: "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
        },
        {
            title: "title",
            content: "content",
            like: 100,
            view: 50,
            comment: 20,
            imgUrl: "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
        },
        {
            title: "title",
            content: "content",
            like: 100,
            view: 50,
            comment: 20,
            imgUrl: "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
        },
        {
            title: "title",
            content: "content",
            like: 100,
            view: 50,
            comment: 20,
            imgUrl: "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
        },
        {
            title: "title",
            content: "content",
            like: 100,
            view: 50,
            comment: 20,
            imgUrl: "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
        },
        {
            title: "title",
            content: "content",
            like: 100,
            view: 50,
            comment: 20,
            imgUrl: "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
        },
        {
            title: "title",
            content: "content",
            like: 100,
            view: 50,
            comment: 20,
            imgUrl: "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
        },
        {
            title: "title",
            content: "content",
            like: 100,
            view: 50,
            comment: 20,
            imgUrl: "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
        },
        {
            title: "title",
            content: "content",
            like: 100,
            view: 50,
            comment: 20,
            imgUrl: "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
        },
    ]

    return (
        <div className="flex flex-1 bg-white overflow-y-auto mx-[30px] md:mx-[50px] xl:mx-[100px] 2xl:mx-[150px]">
            <div className="flex-1 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {testData.map((item, index) => (
                        <div key={index} className="flex flex-col flex-1 rounded-b-lg bg-[#F1F2F4]">
                            <img src={item.imgUrl} className="rounded-t-lg w-[100%] h-[60%]" alt="thumbNail"/>

                            <div className="flex-1 flex flex-col justify-between py-2 px-3">
                                <div>
                                    <div className="text-lg">{item.title}</div>
                                    <div className="text-sm">{item.content}...</div>
                                </div>

                                <div className="flex justify-between text-xs">
                                    <div className="flex space-x-2">
                                        <div className="flex items-center space-x-1">
                                            <AiFillLike className="w-4 h-4"/>
                                            <div>{item.like}</div>
                                        </div>

                                        <div className="flex items-center space-x-1">
                                            <IoGlasses className="w-6 h-6"/>
                                            <div>{item.view}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-1">
                                        <AiOutlineComment className="w-5 h-5"/>
                                        <div>{item.comment}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Main