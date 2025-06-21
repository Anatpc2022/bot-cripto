import TemplatePage from "./TemplatePage";

/**
 * props:
 * - title
 */
export default function FormPage({ title, children }) {
    return (
        <TemplatePage>
            <div className="card card-body border-0 shadow my-4">
                <div className="d-flex justify-content-between flex-nowrap align-items-center py-4">
                    <div className="d-block mb-0">
                        <h2 className="h4">{title}</h2>
                    </div>
                </div>
                <div className="form-group">
                    {children}
                </div>
            </div>
        </TemplatePage>
    )
}