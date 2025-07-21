import { DimensionUnit, NewProduct, UpdateProduct, WeightUnit, NewProductPhysicalPropertiesDefault, ProductTranslations } from '@gofranz/checkoutbay-common';
import { RenderFieldsCreateProps, RenderFieldsEditProps } from '@gofranz/common-components';
import {
  Accordion,
  Group,
  Image,
  JsonInput,
  NumberInput,
  Select,
  Stack,
  Switch,
  TagsInput,
  Tabs,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { UseFormReturnType } from '@mantine/form';
import Decimal from 'decimal.js';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type FormMarkup = UseFormReturnType<NewProduct, (values: NewProduct) => NewProduct>;

function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

export function RenderProductFields(props: RenderFieldsCreateProps<NewProduct>): JSX.Element;
export function RenderProductFields(props: RenderFieldsEditProps<UpdateProduct>): JSX.Element;
export function RenderProductFields({
  form,
}: RenderFieldsCreateProps<NewProduct> | RenderFieldsEditProps<UpdateProduct>): JSX.Element {
  const { t } = useTranslation();
  const [coverImage, setCoverImage] = React.useState<string | undefined>(undefined);
  const [hasPhysicalproperties, setHasPhysicalProperties] = React.useState<boolean>(false);

  useEffect(() => {
    if (form.values.physical_properties) {
      setHasPhysicalProperties(true);
    }
  }, [form.values.physical_properties]);

  useEffect(() => {
    if (form.values.cover_url) {
      setCoverImage(form.values.cover_url);
    }
  }, [form.values.cover_url]);

  const conditionallySetInitialPhysicalProperties = () => {
    if (!hasPhysicalproperties) {
      console.debug('Setting initial physical properties');
      (form as FormMarkup).setFieldValue('physical_properties', NewProductPhysicalPropertiesDefault);
      setHasPhysicalProperties(true);
    } else {
      console.debug('Physical properties already set');
    }
  };

  const weightUnitOptions = Object.values(WeightUnit).map((key) => {
    return { value: key, label: key };
  });

  const dimensionUnitOptions = Object.values(DimensionUnit).map((key) => {
    return { value: key, label: key };
  });

  return (
    <Stack gap={4}>
      <TextInput
        label={t('products.title')}
        placeholder={t('products.titlePlaceholder')}
        withAsterisk
        {...(form as FormMarkup).getInputProps('title')}
        onChange={(event) => {
          (form as FormMarkup).getInputProps('title').onChange(event);
          const newSlug = createSlugFromTitle(event.currentTarget.value);
          (form as FormMarkup).setFieldValue('slug', newSlug);
        }}
        error={form.errors.title}
      />

      <Image src={coverImage} w={200} h={200} fit="contain" />

      <TextInput
        label={t('products.coverUrl')}
        placeholder={t('products.coverUrlPlaceholder')}
        {...(form as FormMarkup).getInputProps('cover_url')}
        onChange={(event) => {
          (form as FormMarkup).getInputProps('cover_url').onChange(event);
          setCoverImage(event.currentTarget.value);
        }}
        error={form.errors.cover_url}
        description={t('products.coverUrlDescription')}
      />

      <TextInput
        label={t('products.slug')}
        placeholder={t('products.slugPlaceholder')}
        withAsterisk
        {...(form as FormMarkup).getInputProps('slug')}
        error={form.errors.slug}
        description={t('products.slugDescription')}
      />

      {/* Short Description (Translatable) */}
      <TranslatableTextarea
        label={t('products.description')}
        placeholder={t('products.descriptionPlaceholder')}
        value={(form as FormMarkup).values.description || { en: '', de: undefined, es: undefined, fr: undefined, pt: undefined, zh: undefined, th: undefined, ar: undefined }}
        onChange={(value) => (form as FormMarkup).setFieldValue('description', value)}
        error={form.errors.description}
        minRows={3}
      />
      
      {/* Long Description (Translatable Rich Text) */}
      <TranslatableRichTextEditor
        label={t('products.descriptionLong') || 'Long Description'}
        value={(form as FormMarkup).values.description_long || { en: '', de: undefined, es: undefined, fr: undefined, pt: undefined, zh: undefined, th: undefined, ar: undefined }}
        onChange={(value) => (form as FormMarkup).setFieldValue('description_long', value)}
        error={form.errors.description_long}
      />

      <TextInput
        label={t('products.sku')}
        placeholder={t('products.skuPlaceholder')}
        {...(form as FormMarkup).getInputProps('sku')}
        error={form.errors.sku}
        description={t('products.skuDescription')}
      />

      <NumberInput
        label={t('products.price')}
        placeholder={t('products.pricePlaceholder')}
        withAsterisk
        {...(form as FormMarkup).getInputProps('price')}
        value={new Decimal(form.values.price || 0)?.toNumber()}
        error={form.errors.price}
        thousandSeparator=" "
        allowDecimal={true}
        description="Price in the shop's currency"
      />

      <Switch
        label={t('products.allowNegativeStock')}
        {...(form as FormMarkup).getInputProps('allow_negative_stock')}
        defaultChecked={form.values.allow_negative_stock}
      />

      <Text size="xs">{t('products.allowNegativeStockDescription')}</Text>

      <Switch
        label={t('products.isLive')}
        {...(form as FormMarkup).getInputProps('is_live')}
        defaultChecked={form.values.is_live}
      />

      <Text size="xs">{t('products.isLiveDescription')}</Text>

      <Switch
        label={t('products.requiresShipping')}
        {...(form as FormMarkup).getInputProps('requires_shipping')}
        defaultChecked={form.values.requires_shipping}
      />

      <Text size="xs">{t('products.requiresShippingDescription')}</Text>

      <TagsInput
        label={t('products.categories')}
        placeholder={t('products.categoriesPlaceholder')}
        {...(form as FormMarkup).getInputProps('categories')}
        error={form.errors.categories}
      />

      <TagsInput
        label={t('products.tags')}
        placeholder={t('products.tagsPlaceholder')}
        {...(form as FormMarkup).getInputProps('tags')}
        error={form.errors.tags}
      />

      <Accordion variant="contained">
        <Accordion.Item value="json">
          <Accordion.Control>
            <Text fw={500}>{t('products.additionalProperties')}</Text>
            <Text size="sm" c="dimmed">
              {t('products.additionalPropertiesDescription')}
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap={4}>
              <JsonInput
                label={t('products.privateData')}
                placeholder={t('products.privateDataPlaceholder')}
                {...(form as FormMarkup).getInputProps('data')}
                error={form.errors.data}
              />

              <Text size="xs">{t('products.privateDataNote')}</Text>

              <JsonInput
                label={t('products.publicData')}
                placeholder={t('products.publicDataPlaceholder')}
                {...(form as FormMarkup).getInputProps('data_public')}
                error={form.errors.data_public}
              />

              <Text size="xs">{t('products.publicDataNote')}</Text>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Accordion variant="contained">
        <Accordion.Item value="physical">
          <Accordion.Control>
            <Text fw={500}>{t('products.physicalProperties')}</Text>
            <Text size="sm" c="dimmed">
              {t('products.physicalPropertiesDescription')}
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap={4}>
              <Group grow>
                <NumberInput
                  label={t('products.width')}
                  placeholder={t('products.pricePlaceholder')}
                  allowDecimal
                  key={(form as FormMarkup).key('physical_properties.width')}
                  {...(form as FormMarkup).getInputProps('physical_properties.width')}
                  onKeyUp={() => {
                    conditionallySetInitialPhysicalProperties();
                  }}
                  error={form.errors?.['physical_properties.width']}
                />
                <NumberInput
                  label={t('products.height')}
                  placeholder={t('products.pricePlaceholder')}
                  allowDecimal
                  key={(form as FormMarkup).key('physical_properties.height')}
                  {...(form as FormMarkup).getInputProps('physical_properties.height')}
                  onKeyUp={() => {
                    conditionallySetInitialPhysicalProperties();
                  }}
                  error={form.errors?.['physical_properties.height']}
                />
                <NumberInput
                  label={t('products.length')}
                  placeholder={t('products.pricePlaceholder')}
                  allowDecimal
                  key={(form as FormMarkup).key('physical_properties.length')}
                  {...(form as FormMarkup).getInputProps('physical_properties.length')}
                  onKeyUp={() => {
                    conditionallySetInitialPhysicalProperties();
                  }}
                  error={form.errors?.['physical_properties.length']}
                />
              </Group>

              <Select
                label={t('products.dimensionUnit')}
                data={dimensionUnitOptions}
                key={(form as FormMarkup).key('physical_properties.dimension_unit')}
                {...(form as FormMarkup).getInputProps('physical_properties.dimension_unit')}
                onKeyUp={() => {
                  conditionallySetInitialPhysicalProperties();
                }}
                error={form.errors?.['physical_properties.dimension_unit']}
              />

              <NumberInput
                label={t('products.weight')}
                placeholder={t('products.pricePlaceholder')}
                allowDecimal
                key={(form as FormMarkup).key('physical_properties.weight')}
                {...(form as FormMarkup).getInputProps('physical_properties.weight')}
                onKeyUp={() => {
                  conditionallySetInitialPhysicalProperties();
                }}
                error={form.errors?.['physical_properties.weight']}
              />

              <Select
                label={t('products.weightUnit')}
                data={weightUnitOptions}
                key={(form as FormMarkup).key('physical_properties.weight_unit')}
                {...(form as FormMarkup).getInputProps('physical_properties.weight_unit')}
                onKeyUp={() => {
                  conditionallySetInitialPhysicalProperties();
                }}
                error={form.errors?.['physical_properties.weight_unit']}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Text size="xs">{t('products.physicalPropertiesNote')}</Text>
    </Stack>
  );
}

// Language configuration
const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'th', label: 'ไทย', flag: '🇹🇭' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
] as const;

interface TranslatableTextareaProps {
  label: string;
  placeholder: string;
  value: ProductTranslations;
  onChange: (value: ProductTranslations) => void;
  error?: any;
  minRows?: number;
}

function TranslatableTextarea({ label, placeholder, value, onChange, error, minRows = 3 }: TranslatableTextareaProps) {
  const [activeTab, setActiveTab] = useState<string>('en');
  
  const handleTextChange = (text: string) => {
    const updatedValue = {
      ...value,
      [activeTab]: text || undefined,
    };
    
    // Ensure English is always a string
    if (activeTab === 'en') {
      updatedValue.en = text || '';
    }
    
    onChange(updatedValue);
  };

  const getCurrentValue = (): string => {
    if (activeTab === 'en') {
      return value.en || '';
    }
    return (value as any)[activeTab] || '';
  };

  return (
    <div>
      <Text size="sm" fw={500} mb="xs">{label}</Text>
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'en')} variant="outline">
        <Tabs.List>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Tabs.Tab key={lang.code} value={lang.code}>
              {lang.flag} {lang.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {SUPPORTED_LANGUAGES.map((lang) => (
          <Tabs.Panel key={lang.code} value={lang.code} pt="xs">
            <Textarea
              placeholder={activeTab === 'en' ? placeholder : `${placeholder} (${lang.label})`}
              value={getCurrentValue()}
              onChange={(e) => handleTextChange(e.currentTarget.value)}
              error={error}
              minRows={minRows}
              required={activeTab === 'en'}
            />
            {activeTab !== 'en' && (
              <Text size="xs" c="dimmed" mt={4}>
                Falls back to English if empty: "{value.en || 'N/A'}"
              </Text>
            )}
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
}

interface TranslatableRichTextEditorProps {
  label: string;
  value: ProductTranslations;
  onChange: (value: ProductTranslations) => void;
  error?: any;
}

function TranslatableRichTextEditor({ label, value, onChange, error }: TranslatableRichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<string>('en');
  
  const getCurrentValue = (langCode: string): string => {
    if (langCode === 'en') {
      return value.en || '';
    }
    return (value as any)[langCode] || '';
  };

  const handleContentChange = (langCode: string, html: string) => {
    const updatedValue = {
      ...value,
      [langCode]: html || undefined,
    };
    
    // Ensure English is always a string
    if (langCode === 'en') {
      updatedValue.en = html || '';
    }
    
    onChange(updatedValue);
  };

  return (
    <div>
      <Text size="sm" fw={500} mb="xs">{label}</Text>
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'en')} variant="outline">
        <Tabs.List>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Tabs.Tab key={lang.code} value={lang.code}>
              {lang.flag} {lang.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {SUPPORTED_LANGUAGES.map((lang) => (
          <Tabs.Panel key={lang.code} value={lang.code} pt="xs">
            <RichTextEditorForLanguage
              langCode={lang.code}
              content={getCurrentValue(lang.code)}
              onChange={(html) => handleContentChange(lang.code, html)}
              isActive={activeTab === lang.code}
            />
            
            {lang.code !== 'en' && (
              <Text size="xs" c="dimmed" mt={4}>
                Falls back to English if empty: "{value.en || 'N/A'}"
              </Text>
            )}
          </Tabs.Panel>
        ))}
      </Tabs>
      {error && (
        <Text size="xs" c="red" mt={4}>
          {error}
        </Text>
      )}
    </div>
  );
}

interface RichTextEditorForLanguageProps {
  langCode: string;
  content: string;
  onChange: (html: string) => void;
  isActive: boolean;
}

function RichTextEditorForLanguage({ langCode, content, onChange, isActive }: RichTextEditorForLanguageProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editable: isActive, // Only make active tab editable
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && !editor.isDestroyed && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Update editability when tab becomes active/inactive
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(isActive);
    }
  }, [isActive, editor]);

  if (!editor) {
    return null;
  }

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
