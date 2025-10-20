import { DefaultError } from "./ErrorProcessor"

interface IErrorProps {
    err: DefaultError
}

export default function ErrorElement(props: IErrorProps) {
    return (
        <div>
            <p>{props.err.message}</p>
        </div>
    )
}