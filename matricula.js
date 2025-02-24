const matricula = {
    data() {
        return {
            alumnos: [],
            matriculados: [],
            filtroAlumnos: '',
            filtroMatriculados: ''
        };
    },
    methods: {
        async listarAlumnos() {
            const todosLosAlumnos = await db.alumnos.toArray();
            const alumnosMatriculados = await db.matriculas.toArray();
            
            this.alumnos = todosLosAlumnos.filter(alumno =>
                !alumnosMatriculados.some(matriculado => matriculado.idAlumno === alumno.idAlumno)
            );
        },
        async listarMatriculados() {
            this.matriculados = await db.matriculas.toArray();
        },
        async matricularAlumno(alumno) {
            const existe = await db.matriculas.get(alumno.idAlumno);
            if (existe) {
                alertify.warning(`El alumno ${alumno.nombre} ya está matriculado.`);
                return;
            }

            await db.matriculas.put({
                idAlumno: alumno.idAlumno,
                codigo: alumno.codigo,
                nombre: alumno.nombre,
                email: alumno.email,
                direccion: alumno.direccion,
                departamento: alumno.departamento,
                municipio: alumno.municipio,
                distrito: alumno.distrito,
                telefono: alumno.telefono,
                fechanacimiento: alumno.fechanacimiento,
                sexo: alumno.sexo
            });

            alertify.success(`El alumno ${alumno.nombre} ha sido matriculado.`);
            this.listarAlumnos();
            this.listarMatriculados();
        },
        async quitarMatriculacion(alumno) {
            await db.matriculas.delete(alumno.idAlumno);
            alertify.success(`La matriculación del alumno ${alumno.nombre} ha sido eliminada.`);

            this.listarAlumnos();
            this.listarMatriculados();
        },
        async actualizarLista() {
            await this.listarAlumnos();
            await this.listarMatriculados();
            alertify.message('Datos actualizados correctamente');
        }
    },
    computed: {
        alumnosFiltrados() {
            return this.alumnos.filter(alumno => 
                alumno.nombre.toLowerCase().includes(this.filtroAlumnos.toLowerCase()) ||
                alumno.codigo.toLowerCase().includes(this.filtroAlumnos.toLowerCase())
            );
        },
        matriculadosFiltrados() {
            return this.matriculados.filter(matriculado => 
                matriculado.nombre.toLowerCase().includes(this.filtroMatriculados.toLowerCase()) ||
                matriculado.codigo.toLowerCase().includes(this.filtroMatriculados.toLowerCase())
            );
        }
    },
    created() {
        this.listarAlumnos();
        this.listarMatriculados();
    },
    template: `
        <div class='container mt-4'>
            <h5 class="text-primary fw-bold">Buscar Alumno para Matricular</h5>
            <input type='text' v-model='filtroAlumnos' class='form-control mb-3 shadow-sm' placeholder='🔎 Buscar por código o nombre'>

            <button class='btn btn-secondary shadow-lg fw-bold' @click='actualizarLista'>
                <i class="bi bi-arrow-clockwise"></i> Actualizar Datos
            </button>

            <h5 class="mt-4 text-danger fw-bold">Lista de Alumnos (No Matriculados)</h5>
            <div class="table-responsive">
                <table class='table table-hover table-bordered shadow-sm'>
                    <thead class="table-danger">
                        <tr>
                            <th>Código</th><th>Nombre</th><th>Email</th><th>Dirección</th>
                            <th>Departamento</th><th>Municipio</th><th>Distrito</th>
                            <th>Teléfono</th><th>Fecha Nacimiento</th><th>Sexo</th><th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for='alumno in alumnosFiltrados' :key='alumno.idAlumno'>
                            <td>{{ alumno.codigo }}</td>
                            <td>{{ alumno.nombre }}</td>
                            <td>{{ alumno.email }}</td>
                            <td>{{ alumno.direccion }}</td>
                            <td>{{ alumno.departamento }}</td>
                            <td>{{ alumno.municipio }}</td>
                            <td>{{ alumno.distrito }}</td>
                            <td>{{ alumno.telefono }}</td>
                            <td>{{ alumno.fechanacimiento }}</td>
                            <td>{{ alumno.sexo }}</td>
                            <td>
                                <button class='btn btn-primary btn-sm shadow-sm' @click="matricularAlumno(alumno)">
                                    <i class="bi bi-person-check"></i> Matricular
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h5 class="mt-4 text-primary fw-bold">Buscar Alumno Matriculado</h5>
            <input type='text' v-model='filtroMatriculados' class='form-control mb-3 shadow-sm' placeholder='🔎 Buscar por código o nombre'>

            <h5 class="mt-4 text-primary fw-bold">Alumnos Matriculados</h5>
            <div class="table-responsive">
                <table class='table table-hover table-bordered shadow-sm'>
                    <thead class="table-primary">
                        <tr>
                            <th>Código</th><th>Nombre</th><th>Email</th><th>Dirección</th>
                            <th>Departamento</th><th>Municipio</th><th>Distrito</th>
                            <th>Teléfono</th><th>Fecha Nacimiento</th><th>Sexo</th><th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for='matriculado in matriculadosFiltrados' :key='matriculado.idAlumno'>
                            <td>{{ matriculado.codigo }}</td>
                            <td>{{ matriculado.nombre }}</td>
                            <td>{{ matriculado.email }}</td>
                            <td>{{ matriculado.direccion }}</td>
                            <td>{{ matriculado.departamento }}</td>
                            <td>{{ matriculado.municipio }}</td>
                            <td>{{ matriculado.distrito }}</td>
                            <td>{{ matriculado.telefono }}</td>
                            <td>{{ matriculado.fechanacimiento }}</td>
                            <td>{{ matriculado.sexo }}</td>
                            <td>
                                <button class='btn btn-danger btn-sm shadow-sm' @click="quitarMatriculacion(matriculado)">
                                    <i class="bi bi-trash"></i> Quitar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};
