import {FaEyeSlash, FaEye} from "react-icons/fa6"

export const VisibilityToggleIcons = ({ reveal }: { reveal: boolean }) => {
    return  reveal ? <FaEyeSlash/> : <FaEye/>;
}

