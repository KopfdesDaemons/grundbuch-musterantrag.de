import { FormBuilder, FormGroup } from "@angular/forms";
import { Antrag } from "../interfaces/antrag";
import { Antragsteller } from "./antragsteller";
import { Grundbuchamt } from "./grundbuchamt";
import { Grundstueck } from "./grundstueck";
import { RechtAbteilung2 } from "./rechtAbteilung2";

export class AntragLoesschungAbt2 implements Antrag {
    title: string = 'Löschung von Lasten und Beschränkungen';
    description: string = 'z.B. die Löschung eines Wohnungrechts';
    antragsRoute: string = '/antrag/loeschung-abteilung2';
    mehrInfosRoute?: string | undefined;
    templateFileName: string = 'loeschungAbt2';
    erforderlicheUnterlagen: string[] = ['beglaubigte Abschrift des Sterbenachweises oder öffentlich beglaubigte Löschungsbewilligung'];
    gebuehr: string = '25,00 € je Recht';

    antragsteller: Antragsteller = new Antragsteller();
    grundstueck: Grundstueck = new Grundstueck();
    rechtAbteilung2: RechtAbteilung2 = new RechtAbteilung2();
    grundbuchamt: Grundbuchamt = new Grundbuchamt();
    datum: string = '';
    hinweise?: string[] | undefined = ['Stellen Sie sicher, dass die Löschung des Rechts überhaupt möglich ist. Ein Wohnungsrecht kann z.B. ohne Weiteres mit einem Sterbenachweis oder einer Löschungsbewilligung gelöscht werden. Ein Nießbrauchrecht ohne Löschungsklausel kann erst nach Ablauf eines Jahres mit einem Sterbenachweis gelöscht werden, davor sind Löschungsbewilligungen der Erben erforderlich. Bei Löschung von Vormerkungen ist der Inhalt der Bewilligung maßgebend.', 'Für jedes zu löschende Recht erhebt das Grundbuchamt eine Gebühr in Höhe von 25,00 €.', 'Dem Antrag ist zwingend eine beglaubigte Abschrift des Sterbenachweises oder eine öffentlich beglaubigte Löschungsbewilligung beizufügen. Eine einfache Kopie ist nicht ausreichend.'];

    getFormGroup(): FormGroup {
        const formBuilder = new FormBuilder();
        return formBuilder.group({
            antragsteller: this.antragsteller.getFormGroup(),
            grundstueck: this.grundstueck.getFormGroup(),
            rechtAbteilung2: this.rechtAbteilung2.getFormGroup(),
            grundbuchamt: this.grundbuchamt.getFormGroup(),
        });
    }

    loadFormValue(formValue: object): void {
        if (formValue) Object.assign(this, formValue);
        const antrag = formValue as AntragLoesschungAbt2;
        if (antrag) {
            this.antragsteller = new Antragsteller();
            Object.assign(this.antragsteller, antrag.antragsteller);
            this.rechtAbteilung2 = new RechtAbteilung2();
            Object.assign(this.rechtAbteilung2, antrag.rechtAbteilung2)
        }
    }
}