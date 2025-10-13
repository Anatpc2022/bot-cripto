import { useState, useEffect } from "react";

/**
 * props:
 * - id
 * - indexes
 * - symbol
 * - conditions
 * - onChange
 * - automationId
 */
export default function ConditionsArea(props) {
  const [conditions, setConditions] = useState([]); //{ eval: "", text: "" }

  function parseConditions(conditionsText) {
    if (!conditionsText) return [];

    const split = conditionsText.split("&&");
    return split.map((item) => {
      let text = item
        .replaceAll("MEMORY['", "")
        .replaceAll("(", "")
        .replaceAll(")", "")
        .replaceAll("']", "")
        .replaceAll("==", "=")
        .replaceAll(".current", "")
        .replaceAll(props.symbol + ":", "")
        .trim();

      let evalCondition = item.trim();

      return { eval: evalCondition, text };
    });
  }

  useEffect(() => {
    const parsedConditions = parseConditions(props.conditions);
    setConditions(parsedConditions);
  }, [props.conditions]);

  return <div>{JSON.stringify(conditions)}</div>;
}
