import { SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import type { InputRef, RadioChangeEvent } from 'antd'
import { Button, ConfigProvider, Flex, Form, Input, Radio, Space, Switch, Table } from 'antd'
import type { SizeType } from 'antd/es/config-provider/SizeContext'
import ru_RU from 'antd/es/locale/ru_RU'
import type { TablePaginationConfig, TableProps } from 'antd/es/table'
import type { FilterConfirmProps, TableRowSelection } from 'antd/es/table/interface'
import { ColumnType } from 'antd/lib/table'
import { useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import Nav from '../Nav'
import { generateRandomData } from '../generator'
import { EditableCell, EditableRow } from './EditableCell'
import { DataType } from './types'
import styles from './table.module.css'

type EditableTableProps = Parameters<typeof Table>[0]
type TablePaginationPosition = NonNullable<TablePaginationConfig['position']>[number]
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>
type DataIndex = keyof DataType

const defaultTitle = () => 'Название'
const defaultFooter = () => 'Футер'

const AntdProTable = () => {
  // Настройки таблицы
  const [bordered, setBordered] = useState(true)
  const [loading, setLoading] = useState(false)
  const [size, setSize] = useState<SizeType>('large')
  const [showTitle, setShowTitle] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const [showFooter, setShowFooter] = useState(true)
  const [rowSelection, setRowSelection] = useState<TableRowSelection<DataType> | undefined>({})
  const [hasData, setHasData] = useState(true)
  const [top, setTop] = useState<TablePaginationPosition>('none')
  const [bottom, setBottom] = useState<TablePaginationPosition>('bottomRight')
  const [ellipsis, setEllipsis] = useState(false)
  const [yScroll, setYScroll] = useState(true)
  const [xScroll, setXScroll] = useState<string>('scroll')

  // Данные таблицы
  const [dataSource, setDataSource] = useState<DataType[]>(generateRandomData(500))
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  // Рендерит окно поиска по столбцу
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Поиск ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}>
            Поиск
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size='small' style={{ width: 90 }}>
            Сбросить
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              close()
            }}>
            Закрыть
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) => {
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase())
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const columns: (ColumnTypes[number] & { editable?: boolean; dataIndex?: any })[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Имя',
      dataIndex: 'firstName',
      editable: true,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      onFilter: (value: string, record) => record.firstName.startsWith(value),
      filters: [
        {
          text: 'Cersei',
          value: 'Cersei',
        },
        {
          text: 'Jon',
          value: 'Jon',
        },
        {
          text: 'Саб-меню',
          value: 'Submenu',
          children: [
            {
              text: 'Arya',
              value: 'Arya',
            },
            {
              text: 'Rossini',
              value: 'Rossini',
            },
          ],
        },
      ],
    },
    {
      title: 'Фамилия',
      dataIndex: 'lastName',
      editable: true,
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      ...getColumnSearchProps('lastName'),
    },
    {
      title: 'Возраст',
      dataIndex: 'age',
      key: 'age',
      editable: true,
      sorter: (a, b) => a.age - b.age,
      ...getColumnSearchProps('age'),
      render: (text, record) => {
        return {
          props: {
            className: record.age > 50 ? styles.old : styles.young,
          },
          children: text,
        }
      },
    },
    {
      title: 'Полное имя',
      dataIndex: 'fullName',
      render: (_, row) => row.firstName + ' ' + row.lastName,
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phoneNumber',
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      editable: true,
    },
    {
      title: 'Действие',
      dataIndex: 'action',
      fixed: 'right',
      width: '100px',
      render: (_, row) => {
        return <Button type='primary' danger onClick={() => handleDelete(row.id)} icon={<DeleteOutlined />} />
      },
    },
  ]

  const handleBorderChange = (enable: boolean) => {
    setBordered(enable)
  }

  const handleLoadingChange = (enable: boolean) => {
    setLoading(enable)
  }

  const handleSizeChange = (e: RadioChangeEvent) => {
    setSize(e.target.value)
  }

  const handleEllipsisChange = (enable: boolean) => {
    setEllipsis(enable)
  }

  const handleTitleChange = (enable: boolean) => {
    setShowTitle(enable)
  }

  const handleHeaderChange = (enable: boolean) => {
    setShowHeader(enable)
  }

  const handleFooterChange = (enable: boolean) => {
    setShowFooter(enable)
  }

  const handleRowSelectionChange = (enable: boolean) => {
    setRowSelection(enable ? {} : undefined)
  }

  const handleXScrollChange = (e: RadioChangeEvent) => {
    setXScroll(e.target.value)
  }

  const handleDataChange = (newHasData: boolean) => {
    setHasData(newHasData)
  }

  const handleSave = (row: DataType) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.id === item.id)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setDataSource(newData)
  }

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.id !== key)
    setDataSource(newData)
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const scroll: { x?: number | string; y?: number | string } = {}
  if (yScroll) {
    scroll.y = 600
  }
  if (xScroll) {
    scroll.x = '1200px'
  }

  const tableColumns = columns.map((col) => ({
    ...col,
    ellipsis,
    onCell: (record: DataType) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave,
    }),
  }))
  if (xScroll === 'fixed') {
    tableColumns[0].fixed = true
    tableColumns[tableColumns.length - 1].fixed = 'right'
  }

  const tableProps: TableProps<DataType> = {
    bordered,
    loading,
    size,
    title: showTitle ? defaultTitle : undefined,
    showHeader,
    footer: showFooter ? defaultFooter : undefined,
    rowSelection,
    scroll,
    components: {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    },
  }

  return (
    <ConfigProvider locale={ru_RU}>
      <Flex style={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <Nav />
        <Flex align='center' justify='center'>
          <Flex
            align='center'
            justify='center'
            vertical
            style={{ height: '100%', width: '100%', minWidth: '300px', maxWidth: '1200px' }}>
            Настройки:
            <Form layout='inline' className='components-table-demo-control-bar' style={{ marginBottom: 16 }}>
              <Form.Item label='Bordered'>
                <Switch checked={bordered} onChange={handleBorderChange} />
              </Form.Item>
              <Form.Item label='loading'>
                <Switch checked={loading} onChange={handleLoadingChange} />
              </Form.Item>
              <Form.Item label='Title'>
                <Switch checked={showTitle} onChange={handleTitleChange} />
              </Form.Item>
              <Form.Item label='Column Header'>
                <Switch checked={showHeader} onChange={handleHeaderChange} />
              </Form.Item>
              <Form.Item label='Footer'>
                <Switch checked={showFooter} onChange={handleFooterChange} />
              </Form.Item>
              <Form.Item label='Checkbox'>
                <Switch checked={!!rowSelection} onChange={handleRowSelectionChange} />
              </Form.Item>
              <Form.Item label='Has Data'>
                <Switch checked={!!hasData} onChange={handleDataChange} />
              </Form.Item>
              <Form.Item label='Ellipsis'>
                <Switch checked={!!ellipsis} onChange={handleEllipsisChange} />
              </Form.Item>
              <Form.Item label='Size'>
                <Radio.Group value={size} onChange={handleSizeChange}>
                  <Radio.Button value='large'>Large</Radio.Button>
                  <Radio.Button value='middle'>Middle</Radio.Button>
                  <Radio.Button value='small'>Small</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item label='Table Scroll'>
                <Radio.Group value={xScroll} onChange={handleXScrollChange}>
                  <Radio.Button value={undefined}>Unset</Radio.Button>
                  <Radio.Button value='scroll'>Scroll</Radio.Button>
                  <Radio.Button value='fixed'>Fixed Columns</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item label='Pagination Top'>
                <Radio.Group
                  value={top}
                  onChange={(e) => {
                    setTop(e.target.value)
                  }}>
                  <Radio.Button value='topLeft'>TopLeft</Radio.Button>
                  <Radio.Button value='topCenter'>TopCenter</Radio.Button>
                  <Radio.Button value='topRight'>TopRight</Radio.Button>
                  <Radio.Button value='none'>None</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item label='Pagination Bottom'>
                <Radio.Group
                  value={bottom}
                  onChange={(e) => {
                    setBottom(e.target.value)
                  }}>
                  <Radio.Button value='bottomLeft'>BottomLeft</Radio.Button>
                  <Radio.Button value='bottomCenter'>BottomCenter</Radio.Button>
                  <Radio.Button value='bottomRight'>BottomRight</Radio.Button>
                  <Radio.Button value='none'>None</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Form>
            <Table
              {...tableProps}
              pagination={{ position: [top, bottom], pageSizeOptions: ['10', '50', '100', '500'] }}
              columns={tableColumns as ColumnTypes}
              dataSource={hasData ? dataSource : []}
              scroll={scroll}
              rowKey='id'
              // virtual={true}
            />
          </Flex>
        </Flex>
      </Flex>
    </ConfigProvider>
  )
}

export default AntdProTable
