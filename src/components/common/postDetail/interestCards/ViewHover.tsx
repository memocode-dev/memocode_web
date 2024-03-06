import {useState} from "react";
import {IoGlasses} from "react-icons/io5";

const ViewHover = () => {

    const [viewHover, setViewHover] = useState<boolean>(false)

    const handleClickView = () => {
        console.log("view")
    }

    return (
        <div className="flex items-center space-x-2">
            <div
                onMouseOver={() => {
                    setViewHover(true)
                }}
                onMouseOut={() => {
                    setViewHover(false)
                }}
                onClick={handleClickView}
                className="cursor-pointer"
            >
                <IoGlasses className="w-11 h-11"/>
            </div>

            {viewHover ? <div className="text-xl font-semibold">3455</div> : ""}
        </div>
    )
}

export default ViewHover