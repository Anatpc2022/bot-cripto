import { useLocation } from "react-router-dom";

/**
 * props:
 * - count
 * - size
 */
export default function Pagination(props) {
  const PAGE_SIZE = props.size || 10;
  const MAX_PAGES = 10;

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const query = useQuery();

  function getPageClass(page) {
    const queryPage = query.get("page");
    const isActive = queryPage == page || (!queryPage && page === 1);
    return isActive ? "page-item active" : "page-item";
  }

  function getPageLink(page) {
    return `${window.location.pathname}?page=${page}`;
  }

  function getBottom() {
    const moreThanMax = props.count > PAGE_SIZE * MAX_PAGES;
    const moreThanZero = props.count > 0;
    const message1 = moreThanZero ? props.count : "Resultado não encontrado!";
    const message2 = ` resultados.${
      moreThanMax ? " Primeira " + MAX_PAGES + " página." : ""
    }`;

    return (
      <div className="fw-normal small mt-0">
        <b>{message1}</b>
        {moreThanZero ? message2 : " Crie um primeiro."}
      </div>
    );
  }

  let pagesQty = Math.ceil(props.count / PAGE_SIZE);
  pagesQty = pagesQty > MAX_PAGES ? MAX_PAGES : pagesQty;

  const pages = [];
  for (let i = 1; i <= pagesQty; i++) pages.push(i);

  return (
    <div className="card-footer px-3 border-0 d-flex flex-row align-items-center justify-content-between">
      <nav>
        <ul className="pagination mb-0">
          {pages.map((p) => (
            <li key={p} className={getPageClass(p)}>
              <a className="page-link" href={getPageLink(p)}>
                {p}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {getBottom()}
    </div>
  );
}
