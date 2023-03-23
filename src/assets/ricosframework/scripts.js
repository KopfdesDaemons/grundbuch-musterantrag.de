// Accordions #################################################################################

export function initializeAccordions()
{
    var accordions = document.getElementsByClassName("FrageHead");

    for (var i = 0; i < accordions.length; i++) 
    {
      accordions[i].addEventListener("click", function() 
      {
        this.classList.toggle("FrageHeadAngeglickt");
        var Antwort = this.nextElementSibling;
        if (Antwort.style.maxHeight) Antwort.style.maxHeight = null;
        else Antwort.style.maxHeight = Antwort.scrollHeight + "px";
      });
    }
}