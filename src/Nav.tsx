import { Button as MuiButton, Stack } from '@mui/material'
import { Button as AntdButton } from 'antd'
import { useNavigate } from 'react-router-dom'

const Nav = () => {
  const navigate = useNavigate()

  return (
    <Stack direction='row' spacing={2}>
      <MuiButton type='button' variant='contained' size='small' onClick={() => navigate('/mui-table')}>
        Material UI DataGrid
      </MuiButton>
      <AntdButton type='primary' onClick={() => navigate('/antd-table')}>
        Ant Design Table
      </AntdButton>
    </Stack>
  )
}

export default Nav
