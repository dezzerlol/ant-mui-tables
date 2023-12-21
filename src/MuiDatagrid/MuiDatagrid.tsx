import { Container, Stack, alpha, styled } from '@mui/material'
import { DataGrid, GridCellParams, GridColDef, GridValueGetterParams, gridClasses, ruRU } from '@mui/x-data-grid'
import Nav from '../Nav'
import { generateRandomData } from '../generator'
import clsx from 'clsx'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'Имя',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Фамилия',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Возраст',
    type: 'number',
    width: 110,
    editable: true,
    cellClassName: (params: GridCellParams<any, number>) =>
      clsx('table-age', {
        old: params.value > 50,
        young: params.value < 50,
      }),
  },
  {
    field: 'fullName',
    headerName: 'Полное имя',
    description: 'Это поле не редактируется',
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
  {
    field: 'phoneNumber',
    headerName: 'Номер телефона',
    width: 150,
    editable: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 250,
    editable: true,
  },
]

const MuiDatagrid = () => {
  const rows = generateRandomData(500)

  return (
    <Container sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} maxWidth={false} disableGutters>
      <Nav />
      <Stack alignItems='center' justifyContent='center' sx={{ height: '100%', width: '100%' }}>
        <Stack alignItems='center' justifyContent='center' sx={{ height: '100%', maxHeight: '600px' }}>
          <StripedDataGrid
            sx={{ width: '100%', height: '100%' }}
            rows={rows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            editMode='row'
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
          />
        </Stack>
      </Stack>
    </Container>
  )
}

export default MuiDatagrid

const ODD_OPACITY = 0.2

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
        },
      },
    },
  },

  '& .table-age.young': {
    backgroundColor: 'rgba(157, 255, 118, 0.49)',
    color: '#1a3e72',
    fontWeight: '600',
  },
  '& .table-age.old': {
    backgroundColor: '#d47483',
    color: '#1a3e72',
    fontWeight: '600',
  },
}))
