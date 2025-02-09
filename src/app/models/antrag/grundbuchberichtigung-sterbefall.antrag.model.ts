import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Antrag } from "../../interfaces/antrag";
import { Antragsteller } from "../antragsteller.model";
import { Grundbuchamt } from "../grundbuchamt.model";
import { Grundstueck } from "../grundstueck.model";
import { Erblasser } from "../erblasser.model";
import { Image } from "../image.model";
import { NachlassAktenzeichenValidator } from "../../validators/nachlassAktenzeichen.validator";

export class AntragGrundbuchberichtigungSterbefall implements Antrag {
    title: string = 'Grundbuchberichtigung aufgrund eines Sterbefalls'
    description: string = 'Stirbt ein Eigentümer, wird das Grundbuch unrichtig. Die Berichtigung auf die Erben muss beantragt werden.';
    image?: Image | undefined = new Image('/images/erbschein.avif', 'Muster einer Erbscheinsausfertigung', 566, 798)
    gebuehr: string = 'zwei Jahren nach Sterbefall gebührenfrei';
    templateFileName: string = 'grundbuchberichtigung-sterbefall';
    mehrInfosRoute?: string | undefined = '/antragsinfos/sterbefall';
    antragsRoute: string = '/antrag/grundbuchberichtigung-sterbefall';
    erforderlicheUnterlagen: string[] = ['Erbescheinsausfertigung oder beglaubigte Abschrift eines notariellen Testaments'];

    antragsteller: Antragsteller = new Antragsteller();
    erblasser: Erblasser = new Erblasser();
    grundbuchamt: Grundbuchamt = new Grundbuchamt();
    grundstueck: Grundstueck = new Grundstueck();
    erbnachweis: 'Erbschein' | 'notarielles Testament' = 'Erbschein';
    erbnachweisGerichtbekannt: boolean = false;
    aktenzeichenNachlassgericht: string = '';
    weitererGrundbesitz: boolean = true;
    hinweise?: string[] | undefined = ['Die Grundbuchberichtigung ist innerhalb von 2 Jahren ab dem Sterbefall gebührenfrei. Bei einer Berichtigung nach 2 Jahren entsteht die Gebühr für eine Eigentumsumschreibung.',
        'Lassen Sie das Grundbuch nicht berichtigen, wenn Sie die Auseinandersetzung einer Erbengemeinschaft planen. Dies würde bei der zweiten Umschreibung eine Gebühr auslösen, da nur die erste Eintragung gebührenfrei ist.'];

    datum: string = '';

    getFormGroup(): FormGroup {
        const formBuilder = new FormBuilder();
        const formGroup = formBuilder.group({
            antragsteller: this.antragsteller.getFormGroup(),
            erblasser: this.erblasser.getFormGroup(),
            grundstueck: this.grundstueck.getFormGroup(),
            erbnachweis: [this.erbnachweis],
            erbnachweisGerichtbekannt: [this.erbnachweisGerichtbekannt],
            aktenzeichenNachlassgericht: [this.aktenzeichenNachlassgericht, NachlassAktenzeichenValidator()],
            weitererGrundbesitz: [this.weitererGrundbesitz],
            grundbuchamt: this.grundbuchamt.getFormGroup(),
        }, { updateOn: 'submit' });

        /* 
            Prüft ob "Erbnachweis ist vom gleichen Amtsgericht" angehakt ist,
            wenn ja, ist die Angabe des Nachlassaktenzeichens erforderlich
        */
        formGroup.get('erbnachweisGerichtbekannt')?.valueChanges.subscribe((value) => {
            const aktenzeichenControl = formGroup.get('aktenzeichenNachlassgericht');
            if (value) {
                aktenzeichenControl?.setValidators([Validators.required, NachlassAktenzeichenValidator()]);
            } else {
                formGroup.get('aktenzeichenNachlassgericht')?.setValue('');
                aktenzeichenControl?.setValidators([NachlassAktenzeichenValidator()]);
            }
            aktenzeichenControl?.updateValueAndValidity();
        });

        return formGroup;
    }

    loadFormValue(formValue: object): void {
        if (formValue) Object.assign(this, formValue);
        const antrag = formValue as AntragGrundbuchberichtigungSterbefall;
        if (antrag) {
            this.antragsteller = new Antragsteller();
            Object.assign(this.antragsteller, antrag.antragsteller)

            this.erblasser = new Erblasser();
            Object.assign(this.erblasser, antrag.erblasser)
        }
    }
}