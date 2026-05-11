import { fetchVocabDecks } from "@/api/servers/vocabDeckApi";
import GenericVocabGroupList from "@/components/servers/GenericVocabGroupList";

const ManageVocabDecks = () => {
  const fetchApi = (query) =>
    fetchVocabDecks(
      query.page,
      query.size,
      query.sortBy,
      query.direction,
      query.keyword,
    );

  return (
    <GenericVocabGroupList
      title="Manage Vocabulary Decks"
      fetchApi={fetchApi}
    />
  );
};

export default ManageVocabDecks;
