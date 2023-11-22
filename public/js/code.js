const modalAlumno = new bootstrap.Modal(document.getElementById('modalAlumno'))
const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}
on(document, 'click', '.btnEditar', e =>{
    const fila = e.target.parentNode.parentNode
    id_editar.value = fila.children[0].innerHTML
    nombrePry_editar.value = fila.children[1].innerHTML
    nombreCrt_editar.value = fila.children[2].innerHTML
    descripcion_editar.value = fila.children[3].innerHTML
    fechaInicio_editar.value = fila.children[4].innerHTML
    fechaFin_editar.value = fila.children[5].innerHTML
    stakeholder_editar.value = fila.children[6].innerHTML
    modalAlumno.show()
})