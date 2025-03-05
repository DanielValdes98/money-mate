import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { dataFaqs } from "./AccordionFaqs.data";

export function AccordionFaqs() {
  return (
    <div>
      <Accordion className="mb-5" type="single" collapsible>
        {dataFaqs.map(({ id, question, answer }) => (
          <AccordionItem key={id} value={question}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
