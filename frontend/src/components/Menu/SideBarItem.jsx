/**
 * props:
 * - to: url de destino
 * - text: texto do item
 * - onClick: o comportamento de clique deste item
 * - children: imagem svg do ícone
 */
export default function SideBarItem(props) {

    function getClassName(url){
        return window.location.pathname === url ? "nav-item active" : "nav-item";
    }

    return (
        <li className={getClassName(props.to)}>
            <a href={props.to} className="nav-link" onClick={props.onClick}>
                <span className="sidebar-icon">
                    {props.children}
                </span>
                <span className="sidebar-text">{props.text}</span>
            </a>
        </li>
    )
}