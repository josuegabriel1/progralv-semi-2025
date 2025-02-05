const { createApp } = Vue;

createApp({
    data() {
        return {
            alumnos: [],
            codigo: '',
            nombre: '',
            direccion: '',
            telefono: '',
            email: '',
            municipio: '',
            departamento: '',
            fechaNacimiento: '',
            sexo: '',
            botonTexto: 'Guardar'
        };
    },
    methods: {
        eliminarAlumno(alumno) {
            if (confirm(`¿Está seguro de eliminar el alumno ${alumno.nombre}?`)) {
                localStorage.removeItem(alumno.codigo);
                this.listarAlumnos();
            }
        },
        verAlumno(alumno) {
            this.codigo = alumno.codigo;
            this.nombre = alumno.nombre;
            this.direccion = alumno.direccion;
            this.telefono = alumno.telefono;
            this.email = alumno.email;
            this.municipio = alumno.municipio;
            this.departamento = alumno.departamento;
            this.fechaNacimiento = alumno.fechaNacimiento;
            this.sexo = alumno.sexo;
            this.botonTexto = 'Actualizar';
        },
        guardarAlumno() {
            let alumnoExistenteIndex = this.alumnos.findIndex(al => al.codigo === this.codigo);

            if (alumnoExistenteIndex !== -1) {
                // Si el alumno ya existe, pregunta si deseas actualizarlo.
                if (!confirm("¿Deseas actualizar sus datos?")) {
                    return;
                }
                // Actualiza el alumno en el array reactivo
                this.alumnos[alumnoExistenteIndex] = {
                    codigo: this.codigo,
                    nombre: this.nombre,
                    direccion: this.direccion,
                    telefono: this.telefono,
                    email: this.email,
                    municipio: this.municipio,
                    departamento: this.departamento,
                    fechaNacimiento: this.fechaNacimiento,
                    sexo: this.sexo
                };
            } else {
                // Agrega un nuevo alumno si no existe
                this.alumnos.push({
                    codigo: this.codigo,
                    nombre: this.nombre,
                    direccion: this.direccion,
                    telefono: this.telefono,
                    email: this.email,
                    municipio: this.municipio,
                    departamento: this.departamento,
                    fechaNacimiento: this.fechaNacimiento,
                    sexo: this.sexo
                });
            }

            // Actualiza el almacenamiento local
            localStorage.setItem(this.codigo, JSON.stringify(this.alumnos.find(al => al.codigo === this.codigo)));

            alert(alumnoExistenteIndex !== -1 ? "Alumno actualizado con éxito." : "Alumno guardado con éxito.");
            this.limpiarFormulario();
        },
        listarAlumnos() {
            this.alumnos = [];
            for (let i = 0; i < localStorage.length; i++) {
                let clave = localStorage.key(i),
                    valor = localStorage.getItem(clave);
                try {
                    // Verifica si el valor almacenado es un objeto de alumno válido antes de agregarlo.
                    let alumno = JSON.parse(valor);
                    if (alumno && alumno.codigo && alumno.nombre) {
                        this.alumnos.push(alumno);
                    }
                } catch (e) {
                    console.error(`Error al cargar los datos del alumno con clave ${clave}:`, e);
                }
            }
        },
        buscarAlumno() {
            if (!this.codigo) {
                alert("Ingrese un código para buscar.");
                return;
            }

            let alumno = this.alumnos.find(al => al.codigo === this.codigo);
            if (alumno) {
                this.verAlumno(alumno);
                alert("Alumno encontrado.");
            } else {
                alert("Alumno no encontrado.");
            }
        },
        limpiarFormulario() {
            this.codigo = '';
            this.nombre = '';
            this.direccion = '';
            this.telefono = '';
            this.email = '';
            this.municipio = '';
            this.departamento = '';
            this.fechaNacimiento = '';
            this.sexo = '';
            this.botonTexto = 'Guardar';
        }
    },
    created() {
        this.listarAlumnos();
    }
}).mount('#app');
