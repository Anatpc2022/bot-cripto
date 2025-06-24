/**
 * props:
 * - id
 * - data
 * - disabled
 * - onChange
 */
export default function MemoryForm(props) {
    if (!props.data) return <></>;

    return (
        <>
            {
                typeof props.data === "object"
                    ? Object.keys(props.data)
                        .sort()
                        .map(item => (<div>{item}:{JSON.stringify(props.data[item])}</div>))
                    : <div>{props.data}</div>
            }
        </>
    )
}