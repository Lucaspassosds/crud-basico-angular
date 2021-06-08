import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formataNome",
})
export class FormataNomePipe implements PipeTransform {
  transform(value: string, args?: any): string {
    let names = value.split(" ");
    if (names.length < 4) return value;
    const firstName = names.shift();
    const lastName = names.pop();
    names = names.map((name) => name.charAt(0) + ". ");
    return `${firstName} ${names.join(" ")} ${lastName}`;
  }
}
