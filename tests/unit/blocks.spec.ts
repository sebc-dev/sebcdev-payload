import { describe, it, expect } from 'vitest'
import { CodeBlock } from '@/blocks'

describe('CodeBlock', () => {
  it('should have correct slug', () => {
    expect(CodeBlock.slug).toBe('code')
  })

  it('should have correct interfaceName', () => {
    expect(CodeBlock.interfaceName).toBe('CodeBlock')
  })

  it('should have correct labels', () => {
    expect(CodeBlock.labels).toEqual({
      singular: 'Code Block',
      plural: 'Code Blocks',
    })
  })

  it('should have language field as first field', () => {
    const languageField = CodeBlock.fields[0]
    expect(languageField).toMatchObject({
      name: 'language',
      type: 'select',
      required: true,
      defaultValue: 'typescript',
    })
  })

  it('should support 11 programming languages', () => {
    const languageField = CodeBlock.fields[0]
    expect(languageField).toHaveProperty('options')
    // TypeScript type guard for safe property access
    if ('options' in languageField) {
      expect(languageField.options).toHaveLength(11)

      const expectedLanguages = [
        'typescript',
        'javascript',
        'java',
        'python',
        'bash',
        'json',
        'html',
        'css',
        'sql',
        'go',
        'rust',
      ]

      const values = languageField.options.map((opt) => (typeof opt === 'string' ? opt : opt.value))

      expectedLanguages.forEach((lang) => {
        expect(values).toContain(lang)
      })
    }
  })

  it('should have code field as second field', () => {
    const codeField = CodeBlock.fields[1]
    expect(codeField).toMatchObject({
      name: 'code',
      type: 'code',
      required: true,
    })
  })

  it('should have admin config with dynamic language component on code field', () => {
    const codeField = CodeBlock.fields[1]
    expect(codeField).toHaveProperty('admin')
    expect(codeField.admin).toBeDefined()
    expect(codeField.admin).toHaveProperty('components.Field')
    expect((codeField.admin as { components: { Field: string } }).components.Field).toContain(
      'DynamicCodeField',
    )
  })
})
