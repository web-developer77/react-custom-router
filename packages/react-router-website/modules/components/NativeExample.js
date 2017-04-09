import React from 'react'
import PropTypes from 'prop-types'
import Media from 'react-media'
import { Block, Col } from 'jsxstyle'
import Bundle from './Bundle'
import SourceViewer from './SourceViewer'
import SmallScreen from './SmallScreen'
import Loading from './Loading'

const NativeExample = ({ example }) => (
  <Bundle load={example.loadSource}>
    {(src) => src ? (
      <Media query="(min-width: 1170px)">
        {(largeScreen) => (
          <SmallScreen>
            {(smallScreen) => (
              <Block
                minHeight="100vh"
                background="rgb(45, 45, 45)"
                padding="40px"
              >
                <Col
                  position={largeScreen ? 'fixed' : 'static'}
                  width={largeScreen ? '435px' : 'auto'}
                  left="290px"
                  top="40px"
                  bottom="40px"
                >
                  {example.appetizeURL &&
                    <iframe
                      src={`${example.appetizeURL}?device=iphone6&scale=50&autoplay=false&orientation=portrait&deviceColor=white`}
                      width="208px"
                      height="435px"
                      style={smallScreen ? { margin: 'auto' } : null}
                      frameBorder="0"
                      scrolling="no"
                    ></iframe>}
                </Col>
                <SourceViewer
                  code={src}
                  fontSize="11px"
                  marginLeft={largeScreen ? '280px' : null}
                  marginTop={largeScreen ? null : '40px'}
                />
              </Block>
            )}
          </SmallScreen>
        )}
      </Media>
    ) : <Loading/>}
  </Bundle>
)

NativeExample.propTypes = { example: PropTypes.object }

export default NativeExample
