import { FC, useMemo, useState, useEffect } from 'react'
import { Tab, TabList, Tabs } from '@chakra-ui/react'
import { useRouter } from 'next/router'

type ActiveTypes = 'shares' | 'pairs' | 'help'

interface PageTabsProps {
  active: ActiveTypes
}

const PageTabs: FC<PageTabsProps> = ({ active, children }) => {
  const router = useRouter()
  const [index, setIndex] = useState(0)

  const tabToIndex = useMemo(() => ['shares', 'pairs', 'help'], [])

  useEffect(() => {
    setIndex(tabToIndex.findIndex((t) => t === active))
  }, [active, tabToIndex])

  const onTabsChange = (i: number) => {
    router.push(`/${tabToIndex[i]}`)
  }

  return (
    <Tabs index={index} onChange={onTabsChange}>
      <TabList>
        <Tab>Shares</Tab>
        <Tab>Pairs</Tab>
        <Tab>Help</Tab>
      </TabList>
      {children}
    </Tabs>
  )
}

export default PageTabs
