import TemplatePage from "./TemplatePage";

/**
 * props:
 * - title
 * - button
 * - table
 */
export default function ListPage(props) {
    return (
        <TemplatePage>
            <div className="d-flex justify-content-between flex-nowrap align-items-center py-4">
                <div className="d-block mb-0">
                    <h2 className="h4">{props.title}</h2>
                </div>
                <div className="btn-toolbar mb-0">
                    <div className="d-inline-flex align-items-center">
                        {props.button}
                    </div>
                </div>
            </div>
            {props.table}
        </TemplatePage>
    )
}