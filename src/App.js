import React from 'react';
import axios from 'axios';
import {
  Header,
  Button,
  Segment,
  Card,
  Icon,
  Grid
} from 'semantic-ui-react';
import styled, { keyframes} from 'styled-components';
import HeaderText from './HeaderText';

const SearchBox = styled.input.attrs({
  placeholder: 'Search...'
})`
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
`

const ButtonLink = styled.a`
  float: right;
  padding: 10px 30px;
  border-radius: 10px;
  color: ${ props => props.theme.fg } !important;
  background-color: ${ props => props.theme.bg } !important;
`

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const Star = styled.div`
  display: inline-block;
  color: yellow;
  text-shadow: 1px 1px 1px black;
  animation: ${rotate360} 2s linear infinite;
`

const StyledCard = styled(Card)`
  height: 200px;
`
const IssueCard = StyledCard.extend`
  border: solid 4px red !important;
`


const Truncated = styled.div`
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const AppContainer = styled.div`
  background: linear-gradient(to bottom right, aliceblue, black);
`

const Transparent = styled.div`
  background: transparent !important;
`

class App extends React.Component {
  state = { repos: [], visible: [] }

  componentDidMount() {
    //this.getRepos()
  }

  getRepos = () => {
    axios.get('https://api.github.com/users/jefflee801/repos?sort=created')
      .then( res => this.setState({ repos: res.data, visible: res.data }) )
  }

  search = () => {
    const regex = new RegExp(this.term.value.toLowerCase())
    const { repos } = this.state;
    if (this.term.value === '')
      this.setState({ visible: repos })
    else {
      this.setState({
        visible: repos.filter( r => regex.test(r.full_name.toLowerCase()) )
      })
    }
  }

  render() {
    return (
      <AppContainer>
        <Button onClick={this.getRepos}>Repos</Button>
        <SearchBox
          onChange={this.search}
          innerRef={ (n) => this.term = n }
        />
        <Header fSize='large' as={HeaderText}>Portfolio</Header>
        <Segment as={Transparent}>
          <Header as={HeaderText}>Projects</Header>
          <Grid>
            <Grid.Row>
              { this.state.visible.map( r => {
                const RepoCard = r.open_issues > 0 ?
                  IssueCard : StyledCard
                return (
                    <Grid.Column key={r.id} width={4}>
                      <RepoCard>
                        <Card.Content>
                          <Card.Header>
                            <Truncated>
                              { r.full_name }
                            </Truncated>
                          </Card.Header>
                          <Card.Meta>
                            { r.description }
                          </Card.Meta>
                          { r.stargazers_count > 0 &&
                            <Star>
                              <Icon name="start" />
                            </Star>
                          }
                        </Card.Content>
                        <Card.Content extra>
                          <ButtonLink
                            href={r.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                            View
                          </ButtonLink>
                        </Card.Content>
                      </RepoCard>
                    </Grid.Column>
                  )
                }
                )
              }
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment as={Transparent}>
          <Header as={HeaderText}>Contact</Header>
        </Segment>
      </AppContainer>
    )
  }
}

export default App;
