import { useState, useEffect } from "react";
import SmartBadge from "../../../components/SmartBadge";
import IndexSelect from "./IndexSelect";
import VariableInput from "./VariableInput";

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
  const [selectedIndex, setSelectedIndex] = useState({ example: 0 });

  useEffect(() => {
    setSelectedIndex({ example: 0 });
  }, [props.symbol]);

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

      if (props.automationId) {
        text = text.replaceAll(
          "AUTO_ORDER_X",
          "AUTO_ORDER_" + props.automationId
        );
        evalCondition = evalCondition.replaceAll(
          "AUTO_ORDER_X",
          "AUTO_ORDER_" + props.automationId
        );
      }

      return { eval: evalCondition, text };
    });
  }

  function btnRemoveConditionClick(event) {
    const id = event.target.id;
    const pos = conditions.findIndex((c) => c.eval === id);
    conditions.splice(pos, 1);
    props.onChange({
      target: {
        id: props.id,
        value: conditions.map((c) => c.eval).join(" && "),
      },
    });
  }

  function btnAddConditionClick(event) {
    const parsedCondition = parseConditions(event.target.value.eval)[0];
    if (conditions.some((c) => c.eval === parsedCondition.eval)) return;

    conditions.push(parsedCondition);
    props.onChange({
      target: {
        id: props.id,
        value: conditions.map((c) => c.eval).join(" && "),
      },
    });
  }

  useEffect(() => {
    const parsedConditions = parseConditions(props.conditions);
    setConditions(parsedConditions);
  }, [props.conditions]);

  function onIndexSelectChange(event) {
    const item = props.indexes.find((ix) => ix.eval === event.target.value);
    if (item) setSelectedIndex(item);
  }

  return (
    <>
      <div className="row">
        <div className="col-6">
          <IndexSelect
            indexes={props.indexes || []}
            onChange={onIndexSelectChange}
          />
          <VariableInput
            symbol={props.symbol}
            indexes={props.indexes || []}
            onAddClick={btnAddConditionClick}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>
      {conditions ? (
        <div className="divScrollBadges">
          <div className="d-inline-flex flex-row align-content-start">
            {conditions.map((condition, ix) => (
              <SmartBadge
                key={ix}
                id={condition.eval}
                text={condition.text}
                onClick={btnRemoveConditionClick}
              />
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
