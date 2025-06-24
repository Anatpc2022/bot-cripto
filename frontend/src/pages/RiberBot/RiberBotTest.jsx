/**
 * props:
 * - data
 */
function RiberBotTest(props) {
    return (
        <>
            {
                JSON.stringify(props.data)
            }
        </>
    )
}

export default RiberBotTest;